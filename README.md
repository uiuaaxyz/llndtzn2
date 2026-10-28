# Lleno de Tizne — portafolio de Uriel Moreno

Sitio de escritura, gestión cultural y edición independiente. Estética de humo y brasa: grises con degradados, un solo rojo crudo, sin curvas.

**¿Quieres subir un texto, una foto o cambiar tu contacto?** Lee [GUIA.md](GUIA.md): todo se hace desde el panel de
[Pages CMS](https://app.pagescms.org) sin tocar código.

## Cómo está hecho

Sitio estático con [Jekyll](https://jekyllrb.com), que GitHub Pages construye solo en cada cambio.

```
_textos/        Un archivo .md por texto del Archivo (genera textos/<nombre>.html)
_galeria/       Un archivo .md por foto (evento, fecha, fotógrafo, contexto)
_proyectos/     Un archivo .md por proyecto o colectivo
_data/sitio.yml Nombre, biografía, correo, redes
_data/generos.yml  Géneros del Archivo y sus filtros
_layouts/       base.html (estructura) y texto.html (página de lectura)
_includes/      head, header y footer compartidos
assets/css/     tizne.css: colores, fuentes, texturas
assets/js/      tizne.js: ceniza animada, filtros, pestañas, pop-ups, visor de fotos
assets/fotos/   Fotos subidas desde el panel
assets/img/     favicon y og.jpg (vista previa al compartir)
.pages.yml      Configuración del panel Pages CMS
```

## Fuentes

Títulos en **Cormorant Garamond** (itálica en los grandes), cuerpo en **Public Sans**, etiquetas, menús y botones en **JetBrains Mono**.
El rojo de acento es `--rojo` en `assets/css/tizne.css`
(variables `--font-titulos`, `--font-cuerpo` y `--font-mono` en `assets/css/tizne.css`).

## Publicar y probar

- Publicar: *Settings → Pages → Deploy from a branch → `main` / root*. Queda en https://uiuaaxyz.github.io/llndtzn2/
- Si usas dominio propio, cambia `url` y deja `baseurl: ""` en `_config.yml`.
- Probar en local: `gem install jekyll && jekyll serve` y abre http://localhost:4000/llndtzn2/
