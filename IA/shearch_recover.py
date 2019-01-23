#coding utf-8

import subprocess

cmd = 'git fsck --cache --unreachable $(git for-each-ref --format="%(objectname)")'
git_show = "git show {}"

ps = subprocess.Popen(cmd, shell=True,
                           stdout=subprocess.PIPE, 
                           stderr=subprocess.PIPE)


fuckup = ps.communicate()[0].decode('utf-8')
recover_id = []

fuckup_list = fuckup.split('\n')
for e in fuckup_list:
    if e.startswith("unreachable blob"):
        recover_id.append(e.strip("unreachable blob "))


omg = []

for e in recover_id:
    ww = False
    rec = ""
    ps = subprocess.Popen(git_show.format(e), shell=True,
                           stdout=subprocess.PIPE, 
                           stderr=subprocess.PIPE)
    try:
        rec = ps.communicate()[0].decode('utf-8')
        if "#include " in rec:
            ww = True
        else:
            ww = False
    except:
        print("bite file donc balec")
        ww = False
    
    if ww:
        omg.append(rec)


print (omg)

i = 0 

# for save in omg:
#     f = open(str(i) + ".txt", "w+")
#     i+=1
#     f.write(save)
#     f.close
