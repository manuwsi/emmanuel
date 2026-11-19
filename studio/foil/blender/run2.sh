#!/bin/bash
cd /home/claude/ecrin/b3d; rm -f ../out/progress.txt; rm -f ../out/turn/*
for j in "hero2 40" "angles2 32" "phones2 32" "lineup 32" "duo2 32" "turn 18"; do
 set -- $j; s=$(date +%s); python3 shots2.py $1 $2 > ../out/log_$1.txt 2>&1; echo "$1 $(( $(date +%s)-s ))s" >> ../out/progress.txt
done; echo ALL_DONE >> ../out/progress.txt
