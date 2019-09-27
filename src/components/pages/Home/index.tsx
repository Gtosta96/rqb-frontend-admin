import { CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { EPaths } from '../../../settings/constants';
import AgentFirmSVG from './agentFirm.svg';
import BinderSVG from './binder.svg';
import BrokerGroupSVG from './brokerGroup.svg';
import UsersSVG from './user.svg';

const cards = [
  { title: "Users", redirect: EPaths.USERS, img: UsersSVG },
  { title: "Agent Firms", redirect: EPaths.AGENT_FIRMS, img: AgentFirmSVG },
  { title: "Binders", redirect: EPaths.BINDERS, img: BinderSVG },
  { title: "Broker Groups", redirect: EPaths.BROKER_GROUPS, img: BrokerGroupSVG }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-around",
      marginTop: theme.spacing(3)
    },
    card: {
      maxWidth: 345,
      flexBasis: "50%",
      marginBottom: theme.spacing(3)
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

  function redirect(redirect: EPaths) {
    props.history.push(redirect);
  }

  return (
    <div className={classes.root}>
      {cards.map(card => (
        <Card key={card.title} className={classes.card}>
          <CardActionArea onClick={() => redirect(card.redirect)}>
            <CardMedia
              alt={card.title}
              title={card.title}
              image={card.img}
              component="img"
              height="255"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                {card.title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
}

export default React.memo(withRouter(Home));
