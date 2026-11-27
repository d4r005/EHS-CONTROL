import openpyxl,re,warnings
warnings.filterwarnings('ignore')
def lines(path,sheet=0):
    wb=openpyxl.load_workbook(path,data_only=True)
    ws=wb.worksheets[sheet] if isinstance(sheet,int) else wb[sheet]
    out=[]
    for r in ws.iter_rows():
        v=[re.sub(r'\s+',' ',str(c.value).replace('\n',' ')).strip() for c in r if c.value not in (None,'')]
        if v: out.append(v)
    return out
def between(L,start_pred,end_pred):
    i=next(k for k,v in enumerate(L) if start_pred(v))
    j=next((k for k,v in enumerate(L) if k>i and end_pred(v)),len(L))
    return L[i+1:j]
