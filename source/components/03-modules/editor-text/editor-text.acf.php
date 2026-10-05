<?php
	function getEditorTextFields(int $id, int $k): void {
		Timber::render('/03-modules/editor-text/editor-text.twig', [
			'editor_container'	=> true,
			'editor_content'	=> applyContentFilter(getPageBuilderFields($id, $k, 'content'))
		], CACHING);
	}
?>
