#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
plyLoadR <- function(paths, width = NULL, height = NULL, elementId = NULL) {
  x = list(
    paths = as.list(paths)
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'plyLoadR',
    x,
    width = width,
    height = height,
    package = 'plyLoadR',
    elementId = elementId
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
