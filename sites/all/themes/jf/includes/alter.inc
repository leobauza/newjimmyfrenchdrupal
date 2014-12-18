<?php
/**
 * @file
 * alter.inc
 */

function jf_js_alter (&$js) {
  if (arg(0) === 'admin' || arg(1) === 'add' || arg(2) === 'edit' || arg(0) === 'file' || arg(0) === 'panels' || arg(0) === 'ctools') {

  }
  else {
    $jquery_path = '/' . drupal_get_path('theme', 'jf') . '/assets/js/jquery.min.js';
    $js['misc/jquery.js']['data'] = $jquery_path;
    $js['misc/jquery.js']['version'] = '1.9.1';
    $js['misc/jquery.js']['type'] = 'external';
  }
}