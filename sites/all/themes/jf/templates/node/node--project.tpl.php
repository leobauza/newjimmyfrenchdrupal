<?php
/**
 * @file
 * Project nodes
 */

$jf = new jfNodeClass();
// dpm($node);
$fields = $jf->getFieldValues($node, array(
  'field_intro_image',
  'field_case_study_template',
  'field_content_row',
));

// field collection
$content_rows = $jf->loadCollectionItems($fields['field_content_row'], array(
  'field_image_one',
  'field_image_two',
  'field_row_text',
  'field_image_caption',
));

// field collection -> easy variables
// probably not needed? Refactor rows.tpl.inc and rows--basic.tpl.inc
$project_rows = array();
foreach ($content_rows as $key => $item) {

  // $val = $item['value'];
  // $row = $content['field_content_row'][$key]['entity']['field_collection_item'][$val];
  $row = $item;
  $project_rows[$key] = array(
    // 'img' => $jf->projectFieldValue($row, 'field_image_one'),
    // 'img_two' => $jf->projectFieldValue($row, 'field_image_two'),
    // 'text' => $jf->projectFieldValue($row, 'field_row_text'),
    // 'caption' => $jf->projectFieldValue($row, 'field_image_caption'),
    'img' => $row['field_image_one'],
    'img_two' => $row['field_image_two'],
    'text' => $row['field_row_text'],
    'caption' => $row['field_image_caption'],
  );

}

// images
$intro_img = file_create_url($fields['field_intro_image']['uri']);

?>

<?php print render($title_prefix); ?>
  <h2><?php print $title; ?></h2>
<?php print render($title_suffix); ?>
<img src="<?php print $intro_img; ?>" alt="<?php print $title; ?>" />

<?php if ($fields['field_case_study_template']['value'] === 'full' ) : ?>
  <?php require_once __DIR__ . "/../partials/rows.tpl.inc"; ?>
<?php else : ?>
  <?php require_once __DIR__ . "/../partials/rows--basic.tpl.inc"; ?>
<?php endif; ?>

