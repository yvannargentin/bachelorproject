<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/_php_include/param.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo __SOCIETE__;?> : Votre grossiste Suisse en mati&egrave;re d'hygi&egrave;ne m&eacute;dicale et sanitaire</title>
<?php echo EnteteHttpSite();?>
<meta name="Description" content="Procomed, grossiste suisse en matière d'hygiène médicale et sanitaire. Matériel médical, produits d'entretien, matériel de nettoyage, drap d'examen, masque, gants,  bobines, sacs..." />
<meta name="Keywords" content="grossiste sanitaire, santé, médical, cabinet médical, catalogue, hôpital, clinique, soin, materiel medical, accessoires, maxillo-facial, dentaire, cardio-vasculaire, compresses, stérile, non stérile, gant chirurgical, gant médical, pansement, bande de fixation, bandage, protection, champ de protection, serviette, drapage opératoire, stérilisation, thermomètre, désinfection, nettoyage, essuie-main, distributeur, trousse de gynécologie, trousse d'orthopédie, trousse chirurgie général, trousse d'urologie, trousse ORL, charlotte, masque, masque respiratoire, jetable, nitrile, polyethylène, equipement de protection, vinyl, latex, non tissé, chiffon, micro fibre, toque, combinaison, drap d'examen, sac, poubelle, tablier, detergent, nettoyant, coton, seringue, aiguille, perfusion, drainage, injection, perfuseur, sparadraps, gel de contact, bistouris" />
<meta name="Robots" content="index, follow" />
<meta name="msvalidate.01" content="09CC564AAB2A4C0A9C8DF2400823135B" />
<meta name="verify-v1" content="1HiNe5Xudgu+a9SqQCeffvB0XuKuPeAQkynMHQPlH/I=" />
</head>
<body>
	<?php require_once($_SERVER["DOCUMENT_ROOT"].'/_php_include/gabarit/site.php');
	echo CatalogueRayons(3,0);
	require_once($_SERVER["DOCUMENT_ROOT"].'/_php_include/gabarit/pied.php');
?>
</body>
</html>