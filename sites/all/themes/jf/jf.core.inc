<?php
/**
 * @file
 * core jf theme functions
 */

class jfBaseClass
{

  /**
   * Helper method to drupal's field_view_field for multiple values
   * @param  object $node           the drupal node
   * @param  array  $fieldNames     a list of field names
   * @param  string $entity_type    what kind of entity (usually 'node')
   * @return array  $out            an array of usable fields??
   */
  public static function getFieldValues($node, $fieldNames = array(), $entity_type = 'node')
  {

    $out = array();

    foreach ($fieldNames as $name) {

      $field = field_view_field($entity_type, $node, $name);

      if (isset($field['#items']) && count($field['#items']) === 1 ) {
        $out[$name] = $field['#items'][0];
      } else {
        $out[$name] = isset($field['#items'])? $field['#items'] : NULL;
      }

    }

    return $out;

  }

  public static function getView($name, $disp, $args = NULL, $items = NULL)
  {

    $view = views_get_view($name);
    if ($view) {

      $view->set_display($disp);
      // pass arguments
      if (isset($args)) {
        dpm($args . " args");
        $view->set_arguments($args);
      }
      // change the amount of items to show
      if (isset($items)) {
        $view->set_items_per_page($items);
      }

      $view->pre_execute();
      $view->execute();

      $out = $view->result;

    }

    return $out;

  }

  public static function loadCollectionItems($items, $fields = NULL)
  {

    // protect against only one value
    if (isset($items['value'])) {
      $items = array(
        0 => array(
          'value' => $items['value'],
        ),
      );
    }


    $out = array();
    foreach ($items as $key => $item) {
      $field_collection_item = field_collection_item_load($item['value'], $reset = FALSE);
      if (isset($fields)) {
        $out[$key] = self::getFieldValues($field_collection_item, $fields, 'field_collection_item');
      } else {
        $out[$key] = $field_collection_item;
      }
    }
    return $out;

  }

  public static function checkLoggedIn()
  {
    global $user;

    if ( $user->uid ) {

      return TRUE;

    } else {

      return FALSE;

    }
  }

}

class jfNodeClass extends jfBaseClass
{

  // public static function projectFieldValue($row, $field)
  // {
  //
  //   if (isset($row[$field])) {
  //     return $row[$field]['#items'][0];
  //   } else {
  //     return NULL;
  //   }
  //
  // }

}
