# frozen_string_literal: true

# Auto-escape Liquid syntax ({{ }}) inside Markdown code blocks and inline code spans.
#
# Problem:
#   Technical posts often contain Java/Python/etc. code with double curly braces,
#   e.g. `new ArrayList() {{ add("x"); }}` or template literals.
#   Jekyll's Liquid engine processes {{ }} before Markdown rendering,
#   causing "Liquid syntax error" warnings or broken output.
#
# Solution:
#   This hook runs right before Liquid processing (:pre_render).
#   It automatically wraps {{ and }} inside code fences and inline code
#   with {% raw %}...{% endraw %}, so Liquid ignores them.
#
# Usage:
#   Just write code normally — no need to manually add {% raw %} tags.
#   Works for both fenced code blocks (```) and inline code (`...`).

Jekyll::Hooks.register :documents, :pre_render do |doc, payload|
  content = doc.content
  next content unless content.is_a?(String)
  next content unless content.include?('{{')
  # Skip documents already wrapped in {% raw %} (avoids nested raw tags)
  next content if content.strip.start_with?('{% raw %}')

  # Step 1: Extract fenced code blocks to protect them from inline processing.
  code_blocks = {}
  counter = 0
  content.gsub!(/^(`{3,})[^\n]*\n.*?^\1/m) do |block|
    if block.include?('{{')
      key = "\u0000CODEBLOCK#{counter}\u0000"
      code_blocks[key] = block
      counter += 1
      key
    else
      block
    end
  end

  # Step 2: Escape {{ and }} inside inline code spans.
  content.gsub!(/(?<!`)`([^`\n]+)`(?!`)/) do |match|
    inner = Regexp.last_match(1)
    if inner.include?('{{')
      "`{% raw %}#{inner}{% endraw %}`"
    else
      match
    end
  end

  # Step 3: Restore fenced code blocks with raw tags.
  code_blocks.each do |key, block|
    content.sub!(key, "{% raw %}\n#{block}\n{% endraw %}")
  end

  content
end
