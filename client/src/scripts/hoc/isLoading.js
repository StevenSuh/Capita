import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Loading from 'src/scripts/components/loading';

const IsLoadingWrapper = ({ children, init, callback }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    init().then(result => {
      callback(result);
      setIsLoading(false);
    });
  }, [init, callback]);

  return (
    <TransitionGroup className="transition-group">
      <CSSTransition
        appear
        classNames="reveal"
        key={`${isLoading}-isLoading`}
        timeout={{ enter: 200, exit: 0 }}
        unmountOnExit
      >
        {isLoading ? (
          <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Loading size="large" />
            </div>
          </div>
        ) : children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default IsLoadingWrapper;
