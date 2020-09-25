import { CardActionArea, CardContent, CardMedia, Divider, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { EPaths, PATHS_LABEL } from "../../../settings/constants";
import AgentFirmSVG from "./agentFirm.svg";
import BinderSVG from "./binder.svg";
import BrokerGroupSVG from "./brokerGroup.svg";
import DocumentClausesSVG from "./documentClauses.svg";
import UsersSVG from "./user.svg";

const cards = [{ title: PATHS_LABEL["/users"], redirect: EPaths.USERS, img: UsersSVG }];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-between"
    },
    card: {
      flex: "1 0 30%",
      margin: theme.spacing(3)
    },
    cardMedia: {
      backgroundColor: "#e5e5e5",
      objectFit: "unset"
    }
  })
);

interface IProps extends RouteComponentProps {
  open: boolean;
  drawerOptions: {
    width: number;
    animationClass: string;
  };
}

function Home(props: IProps) {
  const classes = useStyles();

  function redirect(path: EPaths) {
    props.history.push(path);
  }

  return (
    <div className={classes.root}>
      {cards.map(card => (
        <Fragment key={card.title}>
          <Card className={classes.card}>
            <CardActionArea onClick={() => redirect(card.redirect)}>
              <CardMedia
                className={classes.cardMedia}
                alt={card.title}
                title={card.title}
                image={card.img}
                component="img"
                height="255"
              />
              <CardContent>
                <Typography gutterBottom={true} variant="h5" component="h2" align="center">
                  {card.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Fragment>
      ))}
    </div>
  );
}

export default React.memo(withRouter(Home));
