import React from 'react';

const list = [
  {
    id: 1,
    strong: 'Record video ',
    text: 'to share what you up to.',
    icon: '🎥',
  },
  {
    id: 2,
    strong: 'Build real relation ',
    text: 'from helping each other and cheering along the way.',
    icon: '💬',
  },
  {
    id: 3,
    strong: 'Be a better you ',
    text: 'by saying no to procrastination.',
    icon: '💪',
  },
];

export const Sidebar = () => {
  return (
    <div className="col-12 col-lg-5 p-4 aside d-none d-md-none d-lg-flex" style={{ height: '670px' }}>
      <h2 style={{ fontWeight: 700 }}>Let's vlog our indie journey together</h2>
      <div className="subtitle my-3">
        Join our IndieLog community to have like-minded indies around, and ship our products together.
      </div>
      <ul className="list m-2">
        {list.map(item => (
          <li className="d-flex mb-2 pb-2" key={item.id}>
            <span className="icon">{item.icon}</span>
            <div>
              <p className="font-size-md mb-0">
                <strong>{item.strong}</strong>
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {/* <small className="text-muted">
        By signing up you agree to our{" "}
        <a href="/terms" className="text-muted">
          terms.
        </a>
      </small> */}
    </div>
  );
};
