<?php

/**
 * @file
 * Block without wrappers
 */
?>
<section class="banner <?php print $classes; ?>"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php print render($title_suffix); ?>
  <?php print $content ?>
</section>
