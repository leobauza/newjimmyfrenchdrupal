<?php
/**
 * @file
 * page.tpl.php
 */
?>

<?php require_once __DIR__ . "/../partials/header.tpl.inc"; ?>

<section class="main-content">

  <div class="drupal__required">
    <?php if (!empty($page['highlighted'])): ?>
      <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
    <?php endif; ?>
    <!-- DISPLAYS MESSAGES AND STUFF -->
    <?php if (!empty($page['help'])): ?>
      <div class="well"><?php print render($page['help']); ?></div>
    <?php endif; ?>

    <?php if (!empty($action_links)): ?>
      <ul class="action-links"><?php print render($action_links); ?></ul>
    <?php endif; ?>
    <?php // print render($page['content']); ?>
  </div>

  <section class="site__hero">
    <a href="<?php print $intro_url['value']; ?>" class="hero__feature">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1272 785" enable-background="new 0 0 1272 785" xml:space="preserve">
        <?php print $svg_paths; ?>
      </svg>
      <img src="<?php print $intro_img; ?>" alt="" />
    </a>

    <?php if (!empty($tabs)): ?>
      <?php print render($tabs); ?>
    <?php endif; ?>

  </section>

  <?php print $messages; ?>

  <section class="grid">

    <?php foreach ($projects as $key => $project): ?>
      <a href="/<?php print $project['url']; ?>" class="grid__item">
        <img src="<?php print $project['thumbnail']; ?>" alt="<?php print $project['title']; ?>" />
      </a>
    <?php endforeach; ?>

  </section>

</section>


<?php require_once __DIR__ . "/../partials/footer.tpl.inc"; ?>
