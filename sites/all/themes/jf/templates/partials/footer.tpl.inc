<footer class="site__footer">
  <div class="container">

    <p class="copy">&copy; <?php print date("Y"); ?></p>

    <nav class="footer__social">
      <ul>
        <li><a target="_blank" class="twitter" href="<?php print theme_get_setting('twitter'); ?>">Twitter</a></li>
        <li><a target="_blank" class="dribbble" href="<?php print theme_get_setting('dribbble'); ?>">Dribbble</a></li>
        <li><a target="_blank" class="instagram" href="<?php print theme_get_setting('instagram'); ?>">Instagram</a></li>
      </ul>
    </nav>

  </div>
</footer>

<section class="overlay">

  <?php foreach ($projects as $key => $project): ?>
    <a href="/<?php print $project['url']; ?>" class="overlay__item">
      <img src="<?php print $project['thumbnail']; ?>" alt="<?php print $project['title']; ?>" />
    </a>
  <?php endforeach; ?>

</section>
