# frozen_string_literal: true

# Force tab pages to always regenerate in incremental build mode.
#
# Problem:
#   When new files are added to custom collections (_yixue, _zhongyi, etc.),
#   the tab list pages (which iterate over collection docs) are NOT
#   automatically rebuilt by --incremental, because Jekyll's incremental
#   tracker only monitors file modifications, not collection membership.
#
# Solution:
#   After all documents are read, mark tab pages as "always regenerate"
#   so they pick up new collection members automatically.

Jekyll::Hooks.register :site, :post_read do |site|
  site.collections['tabs']&.docs&.each do |doc|
    site.regenerator.add(doc.path) if doc.path
  end
end
