<?php
/**
 * @file
 * rows--basic partial
 */

$layout_classes = array();

?>


<?php foreach ($content_rows as $row): ?>

  <?php

    if ($row['field_row_split']['value'] === '6/4') {
      $layout_classes = array(
        'span6',
        'span4',
      );
    } elseif ($row['field_row_split']['value'] === '4/6') {
      $layout_classes = array(
        'span4',
        'span6',
      );
    } else {
      $layout_classes = array(
        'span5',
        'span5',
      );
    }

  ?>

  <section class="row-fluid -project">
    DIFFERENT!!
    <?php if ( isset($row['field_image_one']) && isset($row['field_image_two']) ): ?>

      <article class="<?php print $layout_classes[0]; ?>">
        <img src="<?php print file_create_url($row['field_image_one']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="<?php print $layout_classes[1]; ?>">
        <img src="<?php print file_create_url($row['field_image_two']['uri']); ?>" alt="<?php print $title ?>" />
      </aside>

    <?php elseif ( isset($row['field_image_one']) && isset($row['field_row_text']) ): ?>

      <article class="<?php print $layout_classes[0]; ?>">
        <img src="<?php print file_create_url($row['field_image_one']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="<?php print $layout_classes[1]; ?>">
        <?php print $row['field_row_text']['value']; ?>
      </aside>

    <?php elseif ( isset($row['field_image_two']) && isset($row['field_row_text']) ): ?>

      <article class="<?php print $layout_classes[0]; ?>">
        <?php print $row['field_row_text']['value']; ?>
      </article>
      <aside class="<?php print $layout_classes[1]; ?>">
        <img src="<?php print file_create_url($row['field_image_two']['uri']); ?>" alt="<?php print $title ?>" />
      </aside>

    <?php else: ?>

      <?php if ( isset($row['field_image_one']) ): ?>
        <img src="<?php print file_create_url($row['field_image_one']['uri']); ?>" alt="<?php print $title ?>" />
      <?php elseif ( isset($row['field_image_two']) ): ?>
        <img src="<?php print file_create_url($row['field_image_two']['uri']); ?>" alt="<?php print $title ?>" />
      <?php else: ?>
        <?php print $row['field_row_text']['value'] ?>
      <?php endif; ?>

    <?php endif; ?>

  </section>

<?php endforeach;