<?php
/**
 * @file
 * preprocessors
 */

function jf_preprocess_page(&$vars) {

  if (isset($vars['node']->type)) {
    $nodetype = $vars['node']->type;
    $vars['theme_hook_suggestions'][] = 'page__' . $nodetype;
  }

  /**
   * All Nodes
   */
   if (isset($vars['node'])) {

     $node = $vars['node'];
     $jf = new jfBaseClass();

   }

  /**
   * Homepage
   */
  if (isset($vars['node']) && $vars['is_front']) {

    // Fields
    $fields = $jf->getFieldValues($node, array(
      'field_intro_image',
      'field_url',
      'field_svg_paths',
    ));

    $intro_img = file_create_url($fields['field_intro_image']['uri']);
    $vars['intro_url'] = $fields['field_url'];
    $vars['intro_img'] = $intro_img;
    $vars['svg_paths'] = $fields['field_svg_paths']['value'];

    // View
    $projects_view = $jf->getView('projects', 'block');
    $projects = array();
    foreach ($projects_view as $key => $project) {

      if (isset($project->field_field_thumbnail[0])) {
        $thumb_url = file_create_url($project->field_field_thumbnail[0]['raw']['uri']);
      } else {
        $thumb_url = NULL;
      }

      $node_url = drupal_get_path_alias('node/' . $project->nid);

      $projects[$key] = array(
        'url' => $node_url,
        'title' => $project->node_title,
        'thumbnail' => $thumb_url,
      );

    }

    $vars['projects'] = $projects;

  }

  /**
   * Project Page
   */
  if (isset($vars['node']) && $vars['node']->type === 'project') {

    $fields = $jf->getFieldValues($node, array(
      'field_subtitle',
      'field_intro_image',
      'body', // intro paragraph
      'field_case_study_template',
      'field_content_row',
      'field_background_colour',
    ));
    // field collection
    if (isset($fields['field_content_row']['value'])) {
      $ids = array(
        0 => array(
          'value' => $fields['field_content_row']['value'],
        ),
      );
    } else {
      $ids = $fields['field_content_row'];
    }
    $content_rows = $jf->loadCollectionItems($ids, array(
      'field_image_one',
      'field_image_two',
      'field_row_text',
      'field_image_caption',
    ));
    // images
    $intro_img = file_create_url($fields['field_intro_image']['uri']);

    $vars['fields'] = $fields;
    $vars['content_rows'] = $content_rows;
    $vars['intro_img'] = $intro_img;
  }

}


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

function jf_preprocess_node(&$vars, $hook) {
  // dpm($vars);
  // dpm($hook);
}
