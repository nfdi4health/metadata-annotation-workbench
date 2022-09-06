import React, { useState } from "react";

import {
  EuiBottomBar,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";

export default (id = "bottomBarWithoutAffordForDisplacement") => {
  const [toggleIdSelected, setToggleIdSelected] = useState(true);

  return (
    <>
      {toggleIdSelected && (
        <EuiBottomBar>
          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem>
              This software is currently under active development. Therefore,
              please forgive any errors that occur.
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                onClick={() => setToggleIdSelected(null)}
                color="ghost"
                size="s"
                iconType="cross"
              >
                close
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiBottomBar>
      )}
    </>
  );
};
