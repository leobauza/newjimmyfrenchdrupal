<?php
/**
 * @file
 * menu.inc
 */

// browncoat theme wrapper function for the primary menu links
function jf_menu_tree__primary(&$variables) {
  return '<ul class="menu nav">' . $variables['tree'] . '</ul>';
}

// browncoat theme wrapper function for the secondary menu links
function jf_menu_tree__secondary(&$variables) {
  return '<ul class="menu nav pull-right">' . $variables['tree'] . '</ul>';
}

// Returns HTML for primary and secondary local tasks.
function jf_menu_local_tasks(&$variables) {
  $output = '';
  //TABS TABS TABS
  if ( !empty($variables['primary']) ) {
    $variables['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $variables['primary']['#prefix'] = '<ul class="nav nav-tabs">';
    $variables['primary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables['primary']);
  }

  if ( !empty($variables['secondary']) ) {
    $variables['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $variables['secondary']['#prefix'] = '<ul class="nav nav-pills">';
    $variables['secondary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables['secondary']);
  }

  return $output;
}

// Returns HTML for primary and secondary local tasks.
function jf_menu_local_task($variables) {
  $link = $variables['element']['#link'];
  $link_text = $link['title'];
  $classes = array();

  if (!empty($variables['element']['#active'])) {
    // Add text to indicate active tab for non-visual users.
    $active = '<span class="element-invisible">' . t('(active tab)') . '</span>';

    // If the link does not contain HTML already, check_plain() it now.
    // After we set 'html'=TRUE the link will not be sanitized by l().
    if (empty($link['localized_options']['html'])) {
      $link['title'] = check_plain($link['title']);
    }
    $link['localized_options']['html'] = TRUE;
    $link_text = t('!local-task-title!active', array('!local-task-title' => $link['title'], '!active' => $active));

    $classes[] = 'active';
  }

  return '<li class="' . implode(' ', $classes) . '">' . l($link_text, $link['href'], $link['localized_options']) . "</li>\n";
}

/**
 * Main Site Navigation
 *
 */
function jf_menu_tree(&$variables) {
  //main menu
  return '<ul class="menu nav">' . $variables['tree'] . '</ul>';
}

// Returns navigational links based on a menu tree
function jf_menu_navigation_links($tree, $lvl = 0) {
  $result = array();

  if (count($tree) > 0) {
    foreach ($tree as $id => $item) {
      // Only work with enabled links
      if (empty($item['link']['hidden'])) {
        $new_item = array(
          'title' => $item['link']['title'],
          'link_path' => $item['link']['link_path'],
          'href' => $item['link']['href'],
        );

        // Dont do drugs and don't do any levels deeper then 1
        if ($lvl < 1) {
          $new_item['below'] = browncoat_menu_navigation_links($item['below'], $lvl+1);
        }

        $result['menu-'. $item['link']['mlid']] = $new_item;
      }
    }
  }

  return $result;
}

function jf_menu_link(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';
  $myclass = 'none';

  if ($element['#below']) {
    // Ad our own wrapper
    unset($element['#below']['#theme_wrappers']);
    $sub_menu = '<ul class="dropdown-menu">' . drupal_render($element['#below']) . '</ul>';
    $element['#localized_options']['attributes']['class'][] = 'dropdown-toggle';
    $element['#localized_options']['attributes']['data-toggle'] = 'dropdown';

    // Check if this element is nested within another
    if ((!empty($element['#original_link']['depth'])) && ($element['#original_link']['depth'] > 1)) {
      // Generate as dropdown submenu
      $element['#attributes']['class'][] = 'dropdown-submenu';
    }
    else {
      // Generate as standard dropdown
      $element['#attributes']['class'][] = 'dropdown';
      $element['#localized_options']['html'] = TRUE;

    }
    // Set dropdown trigger element to # to prevent inadvertant page loading with submenu click
    $element['#localized_options']['attributes']['data-target'] = '#';
  } else {
    //this allows html to render properly out of the l() function
    $element['#localized_options']['html'] = TRUE;
  }


  //set the appropriate path
  if(!empty($element['#localized_options']['menuimg']['path']) && $element['#localized_options']['menuimg']['enable'] != 0){
    $iconPath = file_create_url($element['#localized_options']['menuimg']['path']);
  }

  if(!empty($iconPath)) {
    $linkHtml = '<img src="' . $iconPath .'" />' . $element['#title'];
  } else {
    $linkHtml = $element['#title'];
  }

  //allow html for image
  $options = array(
    'html' => TRUE,
  );

  $output = l( $linkHtml , $element['#href'], $element['#localized_options'], $options);

  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}


/**
 * Not sure
 */
//Returns HTML for a single local action link.
function jf_menu_local_action($variables) {
  $link = $variables['element']['#link'];

  // Build the icon rendering element.
  if (empty($link['icon'])) {
    $link['icon'] = 'plus-sign';
  }
  $icon = '<i class="' . drupal_clean_css_identifier('icon-' . $link['icon']) . '"></i>';

  // Format the action link.
  $output = '<li>';
  if (isset($link['href'])) {
    $options = isset($link['localized_options']) ? $link['localized_options'] : array();

    // If the title is not HTML, sanitize it.
    if (empty($link['localized_options']['html'])) {
      $link['title'] = check_plain($link['title']);
    }

    // Force HTML so we can add the icon rendering element.
    $options['html'] = TRUE;
    $output .= l($icon . $link['title'], $link['href'], $options);
  }
  elseif (!empty($link['localized_options']['html'])) {
    $output .= $icon . $link['title'];
  }
  else {
    $output .= $icon . check_plain($link['title']);
  }
  $output .= "</li>\n";

  return $output;
}

// Get all primary tasks including subsets
function _jf_local_tasks($tabs = FALSE) {
  if ($tabs == '') {
    return $tabs;
  }

  if (!$tabs) {
    $tabs = menu_primary_local_tasks();
  }

  foreach ($tabs as $key => $element) {
    $result = db_select('menu_router', NULL, array('fetch' => PDO::FETCH_ASSOC))
      ->fields('menu_router')
      ->condition('tab_parent', $element['#link']['path'])
      ->condition('context', MENU_CONTEXT_INLINE, '<>')
      ->condition('type', array(MENU_DEFAULT_LOCAL_TASK, MENU_LOCAL_TASK), 'IN')
      ->orderBy('weight')
      ->orderBy('title')
      ->execute();

    $router_item = menu_get_item($element['#link']['href']);
    $map = $router_item['original_map'];

    $i = 0;
    foreach ($result as $item) {
      _menu_translate($item, $map, TRUE);

      //only add items that we have access to
      if ($item['tab_parent'] && $item['access']) {
        //set path to that of parent for the first item
        if ($i === 0) {
          $item['href'] = $element['#link']['href'];
        }

        if (current_path() == $item['href']) {
          $tabs[$key][] = array(
          '#theme' => 'menu_local_task',
          '#link' => $item,
          '#active' => TRUE,
          );
        }
        else {
          $tabs[$key][] = array(
          '#theme' => 'menu_local_task',
          '#link' => $item,
          );
        }

        //only count items we have access to.
        $i++;
      }
    }
  }

  return $tabs;
}