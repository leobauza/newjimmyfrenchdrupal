<?php
/**
 * @file
 * Block View Include
 */

function moduleView($delta) {

  $vars = array();
  $uri_fields = array();

  switch ($delta) {

    case 'alert_banner':
      $fields = array('text', 'url', 'background', 'colour', 'show');
      break;

  }

  // if not setting the variables yourself set them according
  // to the fields array
  if (empty($vars)) {
    $vars = jfmModuleBaseClass::getBlockFields($fields, $delta, $uri_fields);
    $vars['delta'] = $delta;
  }

  $out = theme($delta, $vars);
  return $out;

}