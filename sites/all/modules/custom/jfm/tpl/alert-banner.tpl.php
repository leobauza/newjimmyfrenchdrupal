<?php
/**
 * @file
 * Alert Banner
 */
?>
<?php if ($show): ?>
  <div style="background-color: <?php print $background; ?>" class="banner__inner">
    <a style="color: <?php print $colour; ?>" class="link -ignored" target="_blank" href="<?php print $url; ?>"><?php print $text; ?></a>
    <a href="#" class="dismiss -ignored">&times;</a>
  </div>
<?php endif; ?>
