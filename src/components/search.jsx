import { component$, useSignal, $, useOnDocument, useVisibleTask$ } from '@builder.io/qwik';

const Search = component$(({ data }) => {
  const isModalOpen = useSignal(false);
  const all = useSignal(data);
  const filtered = useSignal(data);

  const handleModal = $(() => {
    isModalOpen.value = !isModalOpen.value;
  });

  const handleBackdrop = $((event) => {
    if (event.target.localName === 'dialog') {
      handleModal();
    }
  });

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

  useVisibleTask$(({ track }) => {
    track(() => isModalOpen.value);
    if (isModalOpen.value) {
      document.getElementById('input').focus();
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      filtered.value = all.value;
    }
  });

  useOnDocument(
    'keydown',
    $((event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        handleModal();
      }
      if (event.key === 'Escape' && isModalOpen.value) {
        handleModal();
      }
    })
  );

  return (
    <>
      <button
        onClick$={handleModal}
        type='button'
        class='not-prose flex justify-between items-center font-medium rounded border border-slate-300 bg-white px-3 py-2 min-w-48'
      >
        <span class='flex items-center gap-x-3'>
          <svg aria-hidden='true' class='h-4 w-4 stroke-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          Search
        </span>

        <kbd class='flex gap-1 font-sans font-semibold'>
          <abbr title='Command' class='no-underline'>
            ⌘
          </abbr>
          K
        </kbd>
      </button>
      {isModalOpen.value ? (
        <dialog
          class='fixed top-0 left-0 flex items-center justify-center bg-black/80 backdrop-blur w-screen h-screen p-4'
          onClick$={handleBackdrop}
        >
          <div class='grow-0 w-full max-w-3xl bg-black p-4 rounded'>
            <div class='flex items-center gap-2 pb-4 border-b border-b-slate-700'>
              <svg aria-hidden='true' class='h-4 w-4 stroke-2 stroke-slate-400' fill='none' viewBox='0 0 24 24'>
                <path stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              <input
                type='text'
                placeholder='Search'
                class='basis-full bg-transparent text-white focus:outline-none'
                onInput$={handleInput}
              />
              <button
                class='text-xs uppercase rounded px-2 py-1 bg-slate-500 text-slate-300'
                aria-label='esc'
                value='esc'
                onClick$={handleModal}
              >
                esc
              </button>
            </div>
            <div class='text-xs mt-2 mb-4 text-slate-500'>{`${
              filtered.value.length > 0 ? filtered.value.length : 0
            } results`}</div>
            <div class='h-[300px] overflow-y-auto'>
              <ul class='list-none p-0 m-0 h-full'>
                {filtered.value.length > 0 ? (
                  filtered.value.map((data, index) => {
                    const { path, title, date, base } = data;
                    return (
                      <li key={index} class='cursor-pointer m-0 p-0 hover:bg-slate-800'>
                        <a href={path} class='block group no-underline'>
                          <div class=' px-4 py-3 text-slate-300 hover:text-white'>
                            <div class='flex items-end pb-4 justify-between'>
                              <time class='text-slate-400 group-hover:text-white text-[0.6rem]'>
                                {new Date(date).toLocaleString('en-US', {
                                  timeZone: 'UTC',
                                  day: 'numeric',
                                  month: 'short',
                                  weekday: 'long',
                                  year: 'numeric',
                                })}
                              </time>
                              <span class='text-[0.65rem] uppercase bg-slate-800 rounded px-1 py-0.5 -mt-2'>
                                {base}
                              </span>
                            </div>
                            {title}
                          </div>
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <div class='flex items-center justify-center text-center h-full'>
                    <div class='font-semibold text-lg text-center text-slate-500 -mt-8'>No results found.</div>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
});

export default Search;
