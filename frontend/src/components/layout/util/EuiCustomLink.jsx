import React from "react";
import { EuiLink, EuiHeaderLink } from "@elastic/eui";
import { useHref, useLinkClickHandler } from "react-router-dom";
/**
 * Wraps EuiLinks with ReactRouter Links
 * @param to Location or href
 * @param external Set to true to show an icon indicating that it is an external link; Defaults to true if target="_blank"
 * @param rest Reminder passed as is to EuiLink cf. https://elastic.github.io/eui/#/navigation/link
 * @returns {JSX.Element}
 * @constructor
 */
export const EuiNavigationLink = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ onClick, replace = false, state, target, to, children, ...rest }, ref) => {
    let href = useHref(to);
    let handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target,
    });

    return (
      <EuiLink
        {...rest}
        href={href}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            handleClick(event);
          }
        }}
        ref={ref}
        target={target}
      >
        {children}
      </EuiLink>
    );
  }
);

export const EuiCustomHeaderLink = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ onClick, replace = false, state, target, to, children, ...rest }, ref) => {
    let href = useHref(to);
    let handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target,
    });
    return (
      <EuiHeaderLink
        {...rest}
        href={href}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            handleClick(event);
          }
        }}
        ref={ref}
        target={target}
      >
        {children}
      </EuiHeaderLink>
    );
  }
);
