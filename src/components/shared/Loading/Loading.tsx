import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

interface IProps {
  classes?: any;
  fullscreen: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      "&.-fullscreen": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }
    }
  });
const Loading = (props: IProps) => (
  <div className={classnames(props.classes.root, { "-fullscreen": props.fullscreen })}>
    <svg
      className="lds-spinner"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="rotate(0 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.9166666666666666s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(30 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.8333333333333334s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(60 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.75s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(90 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.6666666666666666s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(120 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.5833333333333334s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(150 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(180 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.4166666666666667s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(210 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.3333333333333333s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(240 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.25s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(270 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.16666666666666666s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(300 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.08333333333333333s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(330 50 50)">
        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#666">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  </div>
);

Loading.defaultProps = {
  fullscreen: false
};

export default withStyles(styles)(Loading);
