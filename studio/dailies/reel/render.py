import asyncio, sys, subprocess, os, io
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright
FPS=30; SUB=3; SHUTTER=0.5; TOTAL=27.5
CHUNKS=[(0,6.9),(6.9,13.8),(13.8,20.6),(20.6,TOTAL)]
URL='http://127.0.0.1:8765/index.html'
async def shot(pg,t):
    await pg.evaluate(f'draw({t})')
    return np.asarray(Image.open(io.BytesIO(await pg.screenshot(type='jpeg',quality=96))),dtype=np.float32)
async def main(mode,args):
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1080,'height':1920})
        pg.on('console',lambda m:print('console:',m.text,flush=True))
        pg.on('pageerror',lambda e:print('pageerror:',e,flush=True))
        await pg.goto(URL); await pg.wait_for_function('isReady()',timeout=120000)
        if mode=='test':
            import time
            for a in args:
                t=float(a); s=time.time(); arr=await shot(pg,t)
                Image.fromarray(arr.astype('uint8')).save(f'/tmp/r5_{a}.jpg',quality=88); print(a,round(time.time()-s,2),flush=True)
        else:
            os.makedirs('parts5',exist_ok=True)
            for ci,(a,z) in enumerate(CHUNKS):
                if args and str(ci) not in args: continue
                tmp=f'parts5/c{ci}.tmp.mp4'
                ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','16','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
                for f in range(round(a*FPS),round(z*FPS)):
                    acc=None
                    for s in range(SUB):
                        t=f/FPS+((s+.5)/SUB-.5)*SHUTTER/FPS
                        arr=await shot(pg,max(0,t)); acc=arr if acc is None else acc+arr
                    ff.stdin.write((acc/SUB).round().clip(0,255).astype('uint8').tobytes())
                ff.stdin.close(); ff.wait()
                if ff.returncode==0: os.replace(tmp,f'parts5/c{ci}.mp4'); print('chunk',ci,'ok',flush=True)
        await b.close()
asyncio.run(main(sys.argv[1],sys.argv[2:]))
