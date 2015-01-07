<?php
/**
 * @file
 * rows partial
 */

$layout_classes = array();

?>


<?php foreach ($project_rows as $row): ?>

  <section class="row-fluid -project">

    <?php if ( isset($row['img']) && isset($row['img_two']) ): ?>

      <article class="span6">
        <img src="<?php print file_create_url($row['img']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="span4">
        <img src="<?php print file_create_url($row['img_two']['uri']); ?>" alt="<?php print $title ?>" />
      </aside>

    <?php elseif ( isset($row['img']) && isset($row['text']) ): ?>

      <article class="span5">
        <img src="<?php print file_create_url($row['img']['uri']); ?>" alt="<?php print $title ?>" />
      </article>
      <aside class="span5">
        <?php print $row['text']['value']; ?>
      </aside>

    <?php elseif ( isset($row['img_two']) && isset($row['text']) ): ?>

      <article class="span6">
        <?php print $row['text']['value']; ?>
      </article>
      <aside class="span6">
        <img src="<?php print file_create_url($row['img_two']['uri']); ?>" alt="<?php print $title ?>" />
      </aside>

    <?php else: ?>

      <?php if ( isset($row['img']) ): ?>
        <img src="<?php print file_create_url($row['img']['uri']); ?>" alt="<?php print $title ?>" />
      <?php elseif ( isset($row['img_two']) ): ?>
        <img src="<?php print file_create_url($row['img_two']['uri']); ?>" alt="<?php print $title ?>" />
      <?php else: ?>
        <?php print $row['text']['value'] ?>
      <?php endif; ?>

    <?php endif; ?>

  </section>

<?php endforeach;