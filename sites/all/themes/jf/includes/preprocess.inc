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

    if (isset($node->field_theme_picker)) {
      $theme_picked = field_view_field('node', $node, 'field_theme_picker');
      $theme_picked = $theme_picked['#items'][0]['value'];
    }


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

  }


  /**
   * Information Page
   */
  if (isset($theme_picked) && $theme_picked === 'information') {

    $vars['theme_hook_suggestions'][] = 'page__information';

    // Fields
    $fields = $jf->getFieldValues($node, array(
      'field_intro_image',
      'field_subtitle',
      'body',
      'field_list',
      'field_list_links',
    ));

    $intro_img = file_create_url($fields['field_intro_image']['uri']);
    $vars['intro_img'] = $intro_img;
    $vars['subtitle'] = $fields['field_subtitle']['value'];
    $vars['body'] = $fields['body']['value'];
    $vars['capabilities'] = $fields['field_list'];

    // field collections
    $vars['featured_on'] = $jf->loadCollectionItems($fields['field_list_links'], array(
      'field_text',
      'field_url',
    ));

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
      'field_text_colour',
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
      'field_row_split',
    ));
    // images
    if (isset($fields['field_intro_image']['uri'])) {
      $intro_img = file_create_url($fields['field_intro_image']['uri']);
    } else {
      $intro_img = NULL;
    }


    $vars['fields'] = $fields;
    $vars['content_rows'] = $content_rows;
    $vars['intro_img'] = $intro_img;

  }

}

function jf_preprocess_region(&$vars, $hook) {

  // Use a bare template for these regions.
  $regions = array('form');

  if (in_array($vars['region'], $regions)) {
    $vars['theme_hook_suggestions'][] = 'region__no_wrapper';
  }

}

function jf_preprocess_block(&$vars, $hook) {

  if (isset($vars['block']) && $vars['block']->region === 'form') {
    $vars['theme_hook_suggestions'][] = 'block__forms';
  }

}

function jf_preprocess_node(&$vars, $hook) {
  // dpm($vars);
}
