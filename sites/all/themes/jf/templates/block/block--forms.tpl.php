<?php

/**
 * @file
 * Block template for forms
 */
?>
<div id="<?php print $block_html_id; ?>" class="form--webform <?php print $classes; ?>"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php print render($title_suffix); ?>
  <?php print $content ?>
</div>
