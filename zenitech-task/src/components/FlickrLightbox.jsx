import React, { Component } from 'react';
import buildUrl from 'build-url';
import Gallery from './gallery';
import fetch from 'isomorphic-fetch';
import InfiniteScroll from "react-infinite-scroll-component";


const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

class FlickrLightbox extends Component {
  constructor(props) {
    super(props);

    this.state = { images: [] };
  
  }
  // state = {
  //   images: Array.from({ length: 20 })
  // };
 

  componentWillMount() {
    this.queryFlickrApi(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.queryFlickrApi(nextProps);
  }

  generateApiUrl = (props) => {
    const extras = [
      'url_o',
      'url_m',
      props.thumbnailSizeParam,
      'license',
      'date_upload',
      'date_taken',
      'icon_server',
      'original_format',
      'last_update',
      'geo',
      'tags',
      'machine_tags',
      'o_dims',
      'views',
      'media',
      'path_alias',
      'owner_name',
    ];
    return buildUrl('https://api.flickr.com', {
      path: 'services/rest/',
      queryParams: {
        method:
          props.user_id || props.album_id || props.searchTerm
            ? 'flickr.photos.search'
            : 'flickr.photos.getRecent',
        format: 'json',
        api_key: props.api_key || '',
        user_id: props.user_id || '',
        album_id: props.album_id || '',
        text: props.searchTerm || '',
        per_page: props.limit || Number.MAX_SAFE_INTEGER,
        nojsoncallback: '?',
        extras: extras.join(','),
      },
    });
  };

  queryFlickrApi = (props) => {
    fetch(this.generateApiUrl(props))
      .then((response) => response.json())
      .then((data) => {
        if (!data.photos) {
          throw data;
        }
        this.setState({
          images: data.photos.photo.map((p) => {
            return {
              src:
                p.url_o ||
                p.url_m ||
                'https://s.yimg.com/pw/images/en-us/photo_unavailable.png',
              thumbnail: p[props.thumbnailSizeParam],
              caption: `${p.title || 'Untitled'}: Photo by ${p.ownername}`,
            };
          }),
        });
      })
      .catch((e) => console.error(e));
  };

  fetchMoreData = () => {
    setTimeout(() => {
      this.setState({
        images: this.state.images.concat(Array.from({ length: 20 }))
      });
    }, 3500);
  };


  render() {
    return (
      <InfiniteScroll dataLength={this.state.images.length}
      next={this.fetchMoreData}
      hasMore={true}
      loader={<h4>Loading...</h4>}
      >
       
       {/* {this.state.images.map((i, index) => (
            <div style={style}  key={index}>
              div - #{index}
            </div>
          ))}   */}
     <Gallery images={this.state.images}  title={this.props.title}  className={this.props.className} />

    </InfiniteScroll> 
    );
  }
}

FlickrLightbox.defaultProps = {
  thumbnailSizeParam: 'url_m',
};

export default FlickrLightbox;
