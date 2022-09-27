#' Load ply files into a three.js scene
#'
#' @param paths List or vector of directory paths of the ply files to load.
#' @examples
#' plyLoadR(paths = list("./my-ply-file.ply"), ...)
#' @param localFiles Boolean. `TRUE` if the the ply files to load are
#'  contained in paths down from the file where plyLoadR is called.
#'  If `FALSE`, the ply files necessary will be copy and pasted into a
#'  local directory.
#' @param plyCopiesFolder String. The name of the folder where the ply files
#'  will be copied to, in case localFiles is `FALSE`. 
#'  Default value is "ply_local_copies".
#' @examples
#' plyLoadR(plyCopiesFolder = "save-ply-files-here", ...)
#' @param isWireframe Boolean vector or list. `TRUE` implies that the geometry from the
#'  corresponding ply file will be loaded as a wireframe.
#'  Default value is `FALSE`. 
#' @examples
#' plyLoadR(isWireframe = list(TRUE, TRUE), ...)
#' plyLoadR(isWireframe = TRUE, ...)  # similar to previous example
#' @param isTransparent Boolean vector or list. `TRUE` implies that the geometry from the
#'   corresponding ply file will be loaded as translucent.
#'   Default value is `FALSE`.
#' @examples
#' plyLoadR(isTransparent = list(FALSE, FALSE), ...)
#' plyLoadR(isTransparent = FALSE, ...)  # similar to previous example
#' @param opacity Numeric vector or list. Its values must be between 0 and 1, 
#'  setting the opacity of the corresponding ply file's loaded geometry.
#'  Default value is 1.
#' @examples
#' plyLoadR(opacity = list(1, 0.2), ...)
#' plyLoadR(opacity = list(0.5, 0.5), ...)
#' plyLoadR(opacity = 0.5, ...)  # similar to previous example
#' 
#' @param camera List. Representation, in R form, of Three.js' `camera` object. 
#'  Its properties will be directly transfered to the Three.js scene's `camera`,
#'  therefore, the list's properties must be structured equivalently to a Three.js `camera`.
#'  Default value is `NULL`.
#' @examples
#' plyLoadR(camera = list(position = list(x = 0, y = 0, z = 0)), ...)
#' @param controls List. Representation, in R form, of Three.js' 
#'   `TrackballControls` object. Its properties will be directly transfered to 
#'   the Three.js scene's `TrackballControls`. Therefore, the list's properties must be
#'   structured equivalently to a Three.js `TrackballControls` object. Default value is `NULL`.
#' @examples
#' plyLoadR(controls = list(target = list(x = 10, y = 20, z = 30)), ...)
#' 
#' @param toggleMeshes List. It can contain `labels` (vector or list), 
#'   for the labels of opacity or visibility butttons of the scene; and `showEvolution`,
#'   NULL or Boolean. If `showEvolution` is `TRUE`, a slider and buttons will be added
#'   to control the meshes' opacity. If `showEvolution` is `FALSE`, only buttons
#'   will be added to control the meshes' opacity. 
#'   Default value is `NULL`, for which no slider nor buttons are created.
#' @param showLoadingProgress Boolean. `TRUE` implies that a progress bar will 
#'   show, every two seconds, how many ply files have already been loaded into the scene.
#' 
#' @import htmlwidgets
#'
#' @export
plyLoadR <- function(
  paths, localFiles = TRUE, plyCopiesFolder = "ply_local_copies",
  isWireframe = FALSE, isTransparent = FALSE, opacity = 1,
  camera = NULL, controls = NULL, elementId = NULL, 
  toggleMeshes = NULL, showLoadingProgress = FALSE, 
  width = "100%", height = "65vh"
  ) {
  # If the files are not contained in some path further down
  # the file where this widget is being used, then, loading
  # the ply files in a local server will not be possible.
  if (localFiles != TRUE) { localFiles <- FALSE}

  # In case the ply files are not local (contained further down)
  new_paths <- unlist(paths)
  if (!localFiles) {
    temp_folder_name <- plyCopiesFolder
    # Create the folders for the ply copies
    dir.create(temp_folder_name)
    temp_folder_name <- paste0(
      temp_folder_name, "/", elementId
    )
    dir.create(temp_folder_name)

    for (i in 1:length(paths)) {
      dir.create(paste0(temp_folder_name, "/ply_copy_", i))
      file.copy(
        from = paths[i],
        to = paste0(temp_folder_name, "/ply_copy_", i),
        overwrite = TRUE,
        recursive = FALSE,
        copy.mode = TRUE
      )
      new_paths[i] <- paste0(
        temp_folder_name, "/ply_copy_", i, "/",
        dir(paste0(temp_folder_name, "/ply_copy_", i))
      )
    }
  }

  x = list(
    paths = as.list(new_paths),
    isWireframe = isWireframe,
    isTransparent = isTransparent,
    opacity = opacity,
    camera = camera,
    controls = controls,
    toggleMeshes = toggleMeshes,
    showLoadingProgress = showLoadingProgress
    # settings = ...
  )

  # :::::::::::::::::::::::::::::::::::::::::::
  # Expand certain arguments if their length
  # doesn't match the number of paths given.
  settings_to_expand <- c(
    "isWireframe",
    "isTransparent",
    "opacity"
  )
  # Remove names for values to be applied as labels
  # if ("toggleLabels" %in% names(x)) {
    # x[["toggleLabels"]] <- unname(x[["toggleLabels"]])
  # }
  for (setting in names(x)) {
    if (setting %in% settings_to_expand) {
      if (length(x$paths) > 1) {
        x[[setting]] <- rep(x[[setting]], length.out = length(x$paths))
      } else {
        x[[setting]] <- list(x[[setting]])
      }
    }
  }
  # :::::::::::::::::::::::::::::::::::::::::::
  
  # Create widget
  htmlwidgets::createWidget(
    name = 'plyLoadR',
    x,
    width = width,
    height = height,
    package = 'plyLoadR',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(
      # defaultWidth = "100%",
      padding = 0,
      browser.fill = FALSE
    )
  )
}

#' Shiny bindings for plyLoadR
#'
#' Output and render functions for using plyLoadeR within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a plyLoadR
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name plyLoadR-shiny
#'
#' @export
plyLoadROutput <- function(outputId, width = '100%', height = '65vh'){
  htmlwidgets::shinyWidgetOutput(outputId, 'plyLoadR', width, height, package = 'plyLoadR')
}

#' @rdname plyLoadR-shiny
#' @export
renderPlyLoadR <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, plyLoadROutput, env, quoted = TRUE)
}

#' plyLoadR-HTML-container
#' 
#' @export
plyLoadR_html <- function(...) { htmltools::tags$div(htmltools::tags$div(...)) }
