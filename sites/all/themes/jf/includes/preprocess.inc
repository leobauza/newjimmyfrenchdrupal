<?php
/**
 * @file
 * preprocessors
 */

/** Preprocess variables for region.tpl.php **/
function jf_preprocess_region(&$variables, $hook) {

  // Use a bare template for these regions.
  $regions = array('navigation', 'content');

  // if (in_array($variables['region'], $regions)) {
  //   $variables['theme_hook_suggestions'][] = 'region__no_wrapper';
  // }

}

// Preprocess variables for block.tpl.php
function jf_preprocess_block(&$variables, $hook) {

  // Use a bare template for the page's main content.
  // if ($variables['block_html_id'] == 'block-system-main') {
  //   $variables['theme_hook_suggestions'][] = 'block__no_wrapper';
  // }
  // Use a menu template for these blocks (the HTML ID of the block).
  // Remove the menu block wrapper with the menu > menu-block-wrapper.tpl.php template
  // $blocks = array('block-menu-block-1');
  // if (in_array($variables['block_html_id'], $blocks)) {
  //   $variables['theme_hook_suggestions'][] = 'block__menu_block';
  // }

  //kpr($variables['block']);

}