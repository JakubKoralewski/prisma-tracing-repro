#!/usr/bin/env python3

import subprocess
from pathlib import Path
from os import chdir
import logging
logging.basicConfig(level=logging.DEBUG)

HERE = Path(__file__).absolute().parent
print('here:', HERE)

def make_filename_safe(filename):
    return "".join([c for c in filename if c.isalpha() or c.isdigit() or c==' ']).rstrip()

url = 'http://localhost:3000'
subdir = HERE / 'profiling-results'
subdir.mkdir(exist_ok=True)
web_app = HERE / '..'
chdir(web_app)

def run_profiling_on_endpoints_txt_file(file_path):
    global subdir
    print('Profiling endpoints in', file_path)
    subdir = subdir / make_filename_safe(file_path)
    subdir.mkdir(exist_ok=True)
    with open(HERE / file_path, 'r') as e:
        for line in e:
            if line.startswith('#'): continue
            profiling_cmd = line.replace("$url", url).strip()
            profiling_cmd = profiling_cmd.split(' ')
            results_filename = make_filename_safe(line)
            print(f'Profiling "{profiling_cmd}". Saving to {results_filename}')
            with open(subdir / results_filename, 'w+') as result:
                cmd = ['ab', '-n', '400', '-c', '100', *profiling_cmd]
                result.write(' '.join(cmd) + '\n')
                result.write(str(cmd) + '\n')
                result.flush()
                subprocess.run(cmd, stdout=result, stderr=result)

run_profiling_on_endpoints_txt_file('endpoints.txt')
