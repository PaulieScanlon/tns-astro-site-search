import { component$, useSignal, $ } from '@builder.io/qwik';

const Search = component$(({ data }) => {
  const all = useSignal(data);
  const filtered = useSignal(data);

  const handleInput = $(async (event) => {
    const FuseModule = await import('fuse.js');
    const Fuse = FuseModule.default;

    const {
      target: { value },
    } = event;

    const fuse = new Fuse(all.value, {
      threshold: 0.5,
      keys: ['title', 'date'],
    });

    const results = fuse.search(value).map((data) => {
      const {
        item: { base, path, title, date },
      } = data;

      return {
        title,
        date,
        path,
        base,
      };
    });

    if (value) {
      filtered.value = results;
    } else {
      filtered.value = all.value;
    }
  });

  return (
    <div>
      <input id='input' type='text' placeholder='Search' onInput$={handleInput} />
      <ul>
        {filtered.value.length > 0
          ? filtered.value.map((data, index) => {
              const { path, title } = data;
              return (
                <li key={index}>
                  <a href={path}>{title}</a>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
});

export default Search;
