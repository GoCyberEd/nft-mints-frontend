import './nft-detail.styles.scss';

type NftDetailProps = {
  title : string;
  description : string;
  link: string;
  collectionAddress: "",
  rate: 10,
  maxMint: 100,
  uuid: string;
  priceId: string;
  userUuid: any;
  productId: string;
  collectionImage: string; 



  // name: string,
  // imgUrl : string,

  // tokenId: string
}

const NftDetail = (props: NftDetailProps) => {
  const { title, description, collectionImage, link } = props;
  return (
    <div className='nft-detail-container'>
      <div className='nft-detail-image' style={{ 
        backgroundImage: `url(${collectionImage})` }}>
        <div className="nft-detail-title">
          <h4>{title}</h4>
        </div>
      </div>
      <div className='nft-detail-info'>
        <h5>{description}</h5>
        <p>Unlockable Content attached to</p>
        <p><a href={link} target='_blank' rel="noreferrer">LINK</a></p>
      </div>
      
    </div>
  );
}

export default NftDetail;