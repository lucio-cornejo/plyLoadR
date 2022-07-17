# plyLoadR

## Goal

This htmlwidget aims to provide an alternative
to the use of the rgl htmlwidget, but only
in the cases where such widget does not
optimally render graphics. 

As an alternative, the three.js library is
being used in order to render graphics.

These are sme of the cases where the 
plyLoadR widget is, in the opinion of its
creator (me and all my bias), a great
alternative to rgl:

1. Display graphics with opacity.
2. Render some scene where the geometries 
for rgl have already been created, but the
rendering of the respective file (Rmd, 
for example) takes too long to finish
or perhaps never concludes.
3. Non trivial JavaScript manipulation 
of the graphics rendered is required. 

## Solutions

### Case 1

For lightweight graphics, the rgl package
works fine when displaying semi or fully
transparent geometries. However, whenever
the geometry displayed is complex/heavy
enough, the rgl graphics turn out laggy.

The plyLoadR solution consists in, first,
use rgl to save the geometries required
into ply files; and, then, loading such
ply files with the plyLoadR widget. 

That way, there is no lag due to 
semi or fully transparent graphics.

### Case 2

Due to the inability of the rgl package
to load ply objects into the final graphic,
such geometries have to be created every
time its respective file (Rmd, for example)
gets rendered. However, such rendering
process may take too long, even when using
the cache chunk property, due to Pandoc's
conversion of the markdown file into a 
HTML.

Like the previous solution, the plyLoadR
approach requires the conversion of rgl
geometries into ply files. Then, the plyLoadR
widget loads such ply files into the final
HTMl, without the need of rerunning the
rgl code for the geometries' creation, nor
the embedding of such geometries into the
markdown file which Pandoc will convert.

In some cases, such solution has reduced
the rendering time of graphics previously
displayed via rgl, from 5 minutes, to
10 seconds.

### Case 3

The rglwidget does provide JavaScript
methods for modifying the rgl graphic 
inserted into a HTML. However, the 
official documentation for those methods
is quite poor.

Besides this, the use of three.js when
rendering graphics via plyLoadR provides 
many more tools for adding custom 
interactivity to the graphic, via
appropriate JavaScript methods.
