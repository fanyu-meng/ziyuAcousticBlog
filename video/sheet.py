import sys,glob
from PIL import Image
d=sys.argv[1]; out=sys.argv[2]; cols=int(sys.argv[3]) if len(sys.argv)>3 else 4
fs=sorted(glob.glob(d+'/*.jpg')); w,h=540,720
if len(sys.argv)>4: a,b=map(int,sys.argv[4].split(':')); fs=fs[a:b]
im=Image.new('RGB',(cols*(w+8),((len(fs)+cols-1)//cols)*(h+8)),'#666')
for i,f in enumerate(fs): im.paste(Image.open(f).resize((w,h),Image.LANCZOS),((i%cols)*(w+8),(i//cols)*(h+8)))
im.save(out,quality=88); print(len(fs),im.size)
