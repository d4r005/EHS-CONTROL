import openpyxl,re,json,warnings
warnings.filterwarnings('ignore')
import os
B=os.environ.get('FORMATOS_DIR','Formatos').rstrip('/')+'/'
def ws_of(p,i=0): return openpyxl.load_workbook(B+p).worksheets[i]
def txt(v): return re.sub(r'\s+',' ',str(v).replace('\n',' ')).strip()
def rows_first(ws,r0,r1,col=1):
    """lista (texto, negrita) de la primera celda con texto de cada fila entre r0 y r1"""
    out=[]
    for r in range(r0,r1+1):
        for c in ws[r]:
            if c.value not in (None,''):
                out.append((txt(c.value),bool(c.font and c.font.b),r)); break
    return out
def find_row(ws,pred,start=1):
    for r in range(start,ws.max_row+1):
        for c in ws[r]:
            if c.value not in (None,'') and pred(txt(c.value)): return r
    return None

def secciones_check(path,start_pat,end_pat,sheet=0,default='Puntos a revisar'):
    ws=ws_of(path,sheet)
    r0=find_row(ws,lambda t:re.search(start_pat,t,re.I)); r1=find_row(ws,lambda t:re.search(end_pat,t,re.I),r0+1) or ws.max_row+1
    items=rows_first(ws,r0+1,r1-1)
    secs=[];cur=None
    for t,b,r in items:
        if re.fullmatch(r'(si|no|na|n/a|sí)',t,re.I): continue
        if b and not t.endswith('?') :
            cur={'t':t.rstrip(':'),'it':[]}; secs.append(cur)
        else:
            if cur is None: cur={'t':default,'it':[]}; secs.append(cur)
            cur['it'].append(t)
    return [s for s in secs if s['it']] or None
def programa(path,start_pat,end_pat='^Responsable:?$',sheet=0):
    ws=ws_of(path,sheet)
    r0=find_row(ws,lambda t:t.lower()=='ene' or re.fullmatch(r'ene',t,re.I))
    r1=find_row(ws,lambda t:re.search(end_pat,t,re.I),r0+1) or ws.max_row+1
    items=rows_first(ws,r0+1,r1-1)
    out=[];grp=None
    for t,b,r in items:
        if b: grp=t; out.append({'g':t}); continue
        out.append({'e':t})
    return out

def numerado(path,sheet=0,r0=1,r1=None,stop=r'^Observaciones'):
    """secciones cuyo encabezado es una fila con 'Cumple' y los items son filas 'n | texto'"""
    ws=ws_of(path,sheet); r1=r1 or ws.max_row
    secs=[];cur=None
    for r in range(r0,r1+1):
        vals=[(c.value,c) for c in ws[r] if c.value not in (None,'')]
        if not vals: continue
        v0=txt(vals[0][0])
        if re.search(stop,v0,re.I): break
        if len(vals)>=2 and re.fullmatch(r'\d+',v0):
            cur=cur or secs.append({'t':'Puntos a revisar','it':[]}) or secs[-1]
            cur['it'].append(txt(vals[1][0]))
        elif len(vals)>=1 and any(re.fullmatch(r'cumple',txt(v),re.I) for v,_ in vals):
            cur={'t':v0,'it':[]}; secs.append(cur)
        elif len(vals)==1 and vals[0][1].font.b and not re.match(r'^(nombre|favor|trabajo en altura)',v0,re.I) and secs and False:
            pass
    return [s for s in secs if s['it']]
def filas_codigo(path,sheet=0,r0=1,r1=None):
    """filas 'A.1 | texto' / 'I | TITULO' -> secciones"""
    ws=ws_of(path,sheet); r1=r1 or ws.max_row
    secs=[];cur=None
    for r in range(r0,r1+1):
        vals=[txt(c.value) for c in ws[r] if c.value not in (None,'')]
        if len(vals)<2: continue
        c0,c1=vals[0],vals[1]
        if re.fullmatch(r'[A-Z]\.\d+',c0): 
            if cur is None: cur={'t':'Puntos a revisar','it':[]}; secs.append(cur)
            cur['it'].append(f'{c0} {c1}')
        elif re.fullmatch(r'[A-Z]',c0) or re.fullmatch(r'[IVX]+',c0):
            cur={'t':f'{c0}. {c1}','it':[]}; secs.append(cur)
    return [s for s in secs if s['it']]
