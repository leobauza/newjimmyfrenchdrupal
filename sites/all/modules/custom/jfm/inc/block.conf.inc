<?php
/**
 * @file
 * Block Configuration Include
 * @todo
 *   - Add documentation on moduleConfigure and moduleSave
 */

/**
 * [moduleConfigure description]
 * @param  [type] $delta [description]
 * @return [type]        [description]
 */
function moduleConfigure($delta) {

  $fields = array();

  switch ($delta) {

    case 'alert_banner':
      $fields = array(
        'text|Text' => 'textfield',
        'url|URL' => 'textfield',
        'background|Background Hex' => 'textfield',
        'colour|Colour Hex' => 'textfield',
        'show|Show Banner' => 'checkbox',
      );
      break;

  }

  return jfmModuleBaseClass::makeBlockForm($fields, $delta);

}

/**
 * [moduleSave description]
 * @param  [type] $delta [description]
 * @param  [type] $edit  [description]
 * @return [type]        [description]
 */
function moduleSave($delta, $edit) {

  $fields = array();
  $images = array();

  switch ($delta) {

    case 'alert_banner':
      $fields = array('text', 'url', 'background', 'colour', 'show');
      break;

  }

  jfmModuleBaseClass::setBlockFields($fields, $edit, $delta);

}