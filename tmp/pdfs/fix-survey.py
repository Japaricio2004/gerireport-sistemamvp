from pathlib import Path
p=Path('tmp/pdfs/build-test-guide.py')
s=p.read_text(encoding='utf-8')
s=s.replace("['La versión móvil fue cómoda de usar.','[ ]','[ ]','[ ]','[ ]','[ ]'],\n['¿Qué fue lo más confuso o molesto?','____________________________________________','','','','',''],\n['¿Qué cambiarías primero?','____________________________________________','','','','',''],\n],[85*mm,17*mm,17*mm,17*mm,17*mm,17*mm],small=True),P('Cálculos sencillos para presentar al profesor','H2GR')", "['La versión móvil fue cómoda de usar.','[ ]','[ ]','[ ]','[ ]','[ ]'],\n],[85*mm,17*mm,17*mm,17*mm,17*mm,17*mm],small=True),P('Dos preguntas abiertas','H2GR'),table([\n['Pregunta','Respuesta'],\n['¿Qué fue lo más confuso o molesto?','\\n\\n'],\n['¿Qué cambiarías primero?','\\n\\n'],\n],[65*mm,105*mm],small=True),P('Cálculos sencillos para presentar al profesor','H2GR')")
p.write_text(s,encoding='utf-8')
