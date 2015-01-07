<?php
/**
 * @file
 * rows partial
 */

$layout_classes = array();

?>


<?php foreach ($content_rows as $row): ?>
  <section class="row-fluid -project">

    <?php if ( isset($row['field_image_one']) && isset($row['field_image_two']) ): ?>

      <article class="span6">
        <img src="<?php print file_create_url($row['field_image_one']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="span4">
        <img src="<?php print file_create_url($row['field_image_two']['uri']); ?>" alt="<?php print $title ?>" />
      </aside>

    <?php elseif ( isset($row['field_image_one']) && isset($row['field_row_text']) ): ?>

      <article class="span5">
        <img src="<?php print file_create_url($row['field_image_one']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="span5">
        <?php print $row['field_row_text']['value']; ?>
      </aside>

    <?php elseif ( isset($row['field_image_two']) && isset($row['field_row_text']) ): ?>

      <article class="span6">
        <?php print $row['field_row_text']['value']; ?>
      </article>
      <aside class="span6">
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