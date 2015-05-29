<?php
/**
 * @file
 * page.tpl.php
 */
?>

<?php require_once path_to_theme('jf') . "/templates/partials/header.tpl.inc"; ?>

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
    <img class="cancel" src="<?php print $intro_img; ?>" alt="<?php print $title; ?>" />
    <?php if (!empty($tabs)): ?>
      <?php print render($tabs); ?>
    <?php endif; ?>

  </section>
  <?php print $messages; ?>

  <section class="row-fluid--information">
    <section class="span5">
      <div class="inner">
        <article class="info__section">
          <h2><?php print $subtitle; ?></h2>
          <?php print $body; ?>
        </article>
        <article class="info__section row-fluid">
          <div class="span4">
            <h4>Capabilities</h4>
            <ul>
              <?php foreach ($capabilities as $capability): ?>
                <li><?php print $capability['value']; ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
          <div class="span6">
            <h4>Featured On</h4>
            <ul>
              <?php foreach ($featured_on as $feature): ?>
                <li>
                  <a target="_blank" href="<?php print $feature['field_url']['value']; ?>"><?php print $feature['field_text']['value']; ?></a>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>
        </article>
        <article class="info__section l">
          <h4>Connect</h4>
          <ul class="info__social">
            <li><a target="_blank" class="twitter" href="<?php print theme_get_setting('twitter'); ?>">Twitter</a></li>
            <li><a target="_blank" class="dribbble" href="<?php print theme_get_setting('dribbble'); ?>">Dribbble</a></li>
            <li><a target="_blank" class="instagram" href="<?php print theme_get_setting('instagram'); ?>">Instagram</a></li>
            <li><a target="_blank" class="linkedin" href="<?php print theme_get_setting('linkedin'); ?>">LinkedIn</a></li>
          </ul>
        </article>
      </div>
    </section>
    <aside class="span5">
      <article class="info__form" data-form="Contact Form">
        <h2>Let's Work Together</h2>
        <p>I’m always looking for new &amp; interesting projects. If you’re looking for a designer, let’s chat!</p>
        <?php
          print render($page['form']);
        ?>
      </article>
    </aside>
  </section>

</section>

<?php require_once path_to_theme('jf') . "/templates/partials/footer.tpl.inc"; ?>
