<?php
/**
 * @file
 * socialbar include
 */

function getThemeSocialBar($delta) {

  $out = '';

  switch ($delta) {
    case 'social_bar':
      $out =  theme('social_bar');
      break;
  }

  return $out;
}