# frozen_string_literal: true

# Register documents from custom collections (yixue, zhongyi) into
# site.categories and site.tags, so that Chirpy's categories/tags pages
# and the jekyll-archives gem include them.
#
# Jekyll only populates site.categories and site.tags from _posts.
# Custom collections are excluded. This plugin bridges that gap.

Jekyll::Hooks.register :site, :post_read do |site|
  collections_to_register = %w[yixue zhongyi]

  collections_to_register.each do |name|
    collection = site.collections[name]
    next unless collection

    collection.docs.each do |doc|
      # Register categories
      Array(doc.data['categories']).each do |cat|
        site.categories[cat] ||= []
        site.categories[cat] << doc unless site.categories[cat].include?(doc)
      end

      # Register tags
      Array(doc.data['tags']).each do |tag|
        site.tags[tag] ||= []
        site.tags[tag] << doc unless site.tags[tag].include?(doc)
      end
    end
  end
end
