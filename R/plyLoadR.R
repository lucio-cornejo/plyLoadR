#' Load ply files into a three.js scene
#'
#' @param plyFiles A list of ply files to load.
#'
#' @import htmlwidgets
#'
#' @export
plyLoadR <- function(paths, localFiles = TRUE, plyCopiesFolder = "ply_local_copies", ..., width = NULL, height = NULL, elementId = NULL) {
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
    localFiles = localFiles,
    settings = ...
  )

  # Expand some arguments in "settings", if their
  # length doesn't match the number of paths given.
  if ("settings" %in% names(x)) {
    settings_to_expand <- c(
      "isWireframe",
      "isTransparent",
      "opacity",
      "toggleLabels"
    )
    # Remove names for values to be applied as labels
    if ("toggleLabels" %in% names(x$settings)) {
      x$settings[["toggleLabels"]] <- unname(x$settings[["toggleLabels"]])
    }
    for (setting in names(x$settings)) {
      if (setting %in% settings_to_expand) {
        if (length(x$paths) > 1) {
          x$settings[[setting]] <- rep(x$settings[[setting]], length.out = length(x$paths))
        } else {
          x$settings[[setting]] <- list(x$settings[[setting]])
        }
      }
    }
  } 
  
  # Create widget
  htmlwidgets::createWidget(
    name = 'plyLoadR',
    x,
    width = width,
    height = height,
    package = 'plyLoadR',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%",
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
plyLoadROutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'plyLoadeR', width, height, package = 'plyLoadeR')
}

#' @rdname plyLoadR-shiny
#' @export
renderPlyLoadR <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, plyLoadROutput, env, quoted = TRUE)
}
