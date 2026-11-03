from pypdf import PdfReader
from PIL import Image
from pathlib import Path
p=Path('output/pdf/guia-testeo-gerireport-5-tecnicos.pdf')
r=PdfReader(str(p))
print('pages',len(r.pages))
for i,pg in enumerate(r.pages):
    tx=pg.extract_text() or ''
    print(i+1,len(tx),tx[:100].replace('\n',' | '))
imgs=[Image.open(str(x)).convert('RGB') for x in sorted(Path('tmp/pdfs').glob('guia-testeo-*.png'))]
print('rendered',len(imgs))
thumb=[]
for im in imgs:
    im.thumbnail((340,480))
    c=Image.new('RGB',(360,510),'#e8eeeb')
    c.paste(im,((360-im.width)//2,10))
    thumb.append(c)
cols=3
rows=(len(thumb)+cols-1)//cols
sheet=Image.new('RGB',(cols*360,rows*510),'white')
for i,im in enumerate(thumb): sheet.paste(im,((i%cols)*360,(i//cols)*510))
sheet.save('tmp/pdfs/guia-contact-sheet.png')
