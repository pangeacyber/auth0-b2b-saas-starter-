import { useState } from "react"

export const Tabs = ({
  tabs,
  defaultIndex,
}: {
  tabs: { title: string; content: React.ReactNode }[]
  defaultIndex?: number
}) => {
  const [index, setIndex] = useState(defaultIndex || 0)

  const tabTitles = tabs.map(({ title }, i) => {
    const idx = i
    const selected =
      "inline-block p-4 font-sans font-semibold border-b-2 border-black rounded-t-lg active dark:text-white dark:border-white"
    const notSelected =
      "inline-block p-4 font-sans border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"

    return (
      <li key={`tabtitle-${title}-${idx}`} className="me-2" role="presentation">
        <button
          className={idx == index ? selected : notSelected}
          type="button"
          role="tab"
          aria-controls={`${title}`}
          aria-selected={i == idx}
          onClick={() => setIndex(idx)}
        >
          {title}
        </button>
      </li>
    )
  })

  const tabContent = tabs.map(({ title, content }, i) => (
    <div
      className={`${i != index && "hidden"} rounded-lg bg-gray-100 p-4 dark:bg-gray-800`}
      key={`tabcontent-${title}-${i}`}
      role="tabpanel"
      aria-labelledby={`${title}-tab`}
    >
      {content}
    </div>
  ))

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="-mb-px flex flex-wrap text-center text-sm font-medium"
          id="default-tab"
          role="tablist"
        >
          {tabTitles}
        </ul>
      </div>
      <div id="default-tab-content">{tabContent}</div>
    </>
  )
}
