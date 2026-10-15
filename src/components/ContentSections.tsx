import type { ContentPageText } from '../content/publicContent';

export default function ContentSections({ content }: { content: ContentPageText }) {
  return (
    <article className="max-w-3xl mx-auto px-4 pt-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{content.h1}</h1>
      <p className="text-lg text-gray-600 mb-10">{content.intro}</p>

      {content.sections.map((section) => {
        const List = section.ordered ? 'ol' : 'ul';
        return (
          <section key={section.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="text-gray-700 leading-relaxed mb-4">{p}</p>
            ))}
            {section.items && (
              <List className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={item.text} className="card p-4 flex gap-4">
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 shrink-0 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm"
                    >
                      {section.ordered ? i + 1 : '✓'}
                    </span>
                    <span>
                      {item.title && <strong className="block text-gray-900">{item.title}</strong>}
                      <span className="text-gray-600">{item.text}</span>
                    </span>
                  </li>
                ))}
              </List>
            )}
          </section>
        );
      })}
    </article>
  );
}
