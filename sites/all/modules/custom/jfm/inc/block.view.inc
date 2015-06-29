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
      $vars = array(
        'something' => 'this is a sample!',
      );
      break;

  }

  if (empty($vars)) {
    $vars = mainModuleBaseClass::getBlockFields($fields, $delta, $uri_fields);
    $vars['delta'] = $delta;
  }

  $out = theme($delta, $vars);
  return $out;

}