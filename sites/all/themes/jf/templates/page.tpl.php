<?php
/**
 * @file
 * page.tpl.php
 */
?>
<!--

LOGO HEADER

-->
<header>
  <div>Grid Nav</div>
  <?php if (!empty($site_name)): ?>
    <h1 id="brand">
      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>"><?php print $site_name; ?></a>
    </h1>
  <?php endif; ?>
  <div>infolink</div>
</header>

<?php print $messages; ?>

<section class="main-content">
  <?php if (!empty($page['highlighted'])): ?>
    <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
  <?php endif; ?>

  <?php if (!empty($tabs)): ?>
    <?php print render($tabs); ?>
  <?php endif; ?>

  <!-- DISPLAYS MESSAGES AND STUFF -->
  <?php if (!empty($page['help'])): ?>
    <div class="well"><?php print render($page['help']); ?></div>
  <?php endif; ?>

  <?php if (!empty($action_links)): ?>
    <ul class="action-links"><?php print render($action_links); ?></ul>
  <?php endif; ?>
  <?php print render($page['content']); ?>
</section>


<footer class="footer container">
  <?php
    //print theme_get_setting('company_phone');
  ?>
  <p>&copy; Copyright <?php print date("Y"); ?></p>
  <?php print render($page['footer']); ?>
</footer>
