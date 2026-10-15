const headerSearch = document.querySelector('.header-search');

if (headerSearch) {
  const input = headerSearch.querySelector('.mod-input__field');
  const ajaxResults = headerSearch.querySelector('.header-search__ajax-results');
  const defaultResults = headerSearch.querySelector('.header-search__default-results');
  const notFound = headerSearch.querySelector('.header-search__not-found');
  const notFoundTitle = notFound?.querySelector('.header-search__title');
  const noResultsTemplate = notFoundTitle?.textContent || '';
  let lastSearchTerm = '';

  attachEvent('.header-search .mod-input__field', 'input', (ev) => {
    const term = ev.target.value.trim();
    ev.target.closest('.header-search').classList.toggle('filled', !!term);

    if (term) {
      headerSearch.classList.add('show-loader');
      updateResults('', '', term);
    }
    else resetResults();
  });

  const resetResults = () => {
    lastSearchTerm = '';
    headerSearch.classList.remove('show-loader');
    ajaxResults.innerHTML = '';
    ajaxResults.classList.add('hide');
    defaultResults.classList.remove('hide');
    notFound.classList.add('hide');
  };

  const formatNoResultsText = (text, term) => {
    const query = term.trim();
    if (!query) return text;
    if (text.includes(query)) return text;

    const configuredQuery = noResultsTemplate.match(/[“"]([^“”"]+)[”"]/)?.[1];
    if (configuredQuery && text.includes(configuredQuery)) return text.split(configuredQuery).join(query);

    const quotedText = text.replace(
      /([“"])[^“”"]*([”"])/,
      (match, openingQuote, closingQuote) => `${openingQuote}${query}${closingQuote}`,
    );
    return quotedText === text ? `${text} “${query}”` : quotedText;
  };

  const updateResults = (html, noResultsText = '', term = input.value.trim(), hasResponse = false) => {
    ajaxResults.innerHTML = html;
    ajaxResults.classList.toggle('hide', !html);
    defaultResults.classList.add('hide');
    notFound.classList.toggle('hide', !hasResponse || !!html || headerSearch.classList.contains('show-loader'));
    if (!html && notFoundTitle) {
      notFoundTitle.textContent = formatNoResultsText(noResultsText || notFoundTitle.textContent, term);
    }
  };

  const searchHeaderPosts = (term) => {
    if (term === lastSearchTerm) return;
    lastSearchTerm = term;

    if (term.length < 3) return;

    headerSearch.classList.add('show-loader');
    notFound.classList.add('hide');

    const formData = new FormData();
    formData.append('action', 'searchHeaderPosts');
    formData.append('term', term);
    formData.append('lang', localData.lang || '');

    axios
      .post(localData.apiURL, formData)
      .then((response) => {
        if (term !== lastSearchTerm) return;

        headerSearch.classList.remove('show-loader');

        if (term !== input.value.trim()) return;

        const data = response?.data?.data || {};
        updateResults(data.html || '', data.no_results_text || '', term, true);
      })
      .catch(() => {
        if (term !== lastSearchTerm) return;

        headerSearch.classList.remove('show-loader');

        if (term === input.value.trim()) updateResults('');
      });
  };

  input?.addEventListener(
    'input',
    debounce(() => {
      searchHeaderPosts(input.value.trim());
    }, 200),
  );

  attachEvent('.header-search__delete', 'click', () => {
    input.value = '';
    input.blur();
    headerSearch.classList.remove('filled');
    resetResults();
  });

  attachEvent('.header-search__recommended-item', 'click', (ev) => {
    input.value = ev.target.textContent.trim();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Open dropdown on focus
  attachEvent('[data-search-toggle]', 'click', () => {
    document.body.classList.add('is-open-search');
    toggleBodyScrollLock(true);

    // Close everything
    document.body.classList.remove('is-open-menu');
    closeAllMenus();

    setTimeout(() => {
      input.focus();
    }, 300);
  });

  // Close dropdown
  attachEvent('.header-search__overlay, .header-search__close', 'click', () => {
    toggleBodyScrollLock(false);
    document.body.classList.remove('is-open-search');
  });

  onKeydown('escape', () => {
    toggleBodyScrollLock(false);
    document.body.classList.remove('is-open-search');
  });
}
